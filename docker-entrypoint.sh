#!/bin/sh
set -e

# Runs as root only long enough to make the upload volume writable, then drops
# to the unprivileged `node` user for the life of the process.
#
# Why this exists: UPLOAD_DIR is a host bind mount created by Coolify and owned
# by root, because every previous release of this image ran as root. Switching
# the container to a non-root user without this would leave the app unable to
# write to it — student photo uploads would fail with EACCES at runtime, long
# after a deploy looked successful.
#
# gosu, not `su`: it execs into the target process rather than forking a shell,
# so PID 1 stays node and SIGTERM from Coolify reaches the graceful-shutdown
# handler in src/index.ts instead of being swallowed.

UPLOAD_DIR="${UPLOAD_DIR:-/data/uploads}"

if [ "$(id -u)" = "0" ]; then
  mkdir -p "$UPLOAD_DIR"
  # Only touch it when it is not already ours — a large existing volume should
  # not be re-walked on every boot.
  if [ "$(stat -c '%u' "$UPLOAD_DIR")" != "$(id -u node)" ]; then
    echo "entrypoint: taking ownership of $UPLOAD_DIR for the node user"
    chown -R node:node "$UPLOAD_DIR"
  fi
  exec gosu node "$@"
fi

# Already unprivileged (e.g. run with --user): nothing to fix, just start.
exec "$@"