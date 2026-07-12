import React, { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, CreditCard, Video, Save, Eye, EyeOff, CheckCircle2, AlertCircle, UserCog } from "lucide-react";
import { ChangePasswordForm } from "@/components/change-password-form";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 ${checked ? "bg-[#1B2B6B]" : "bg-gray-200"}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 items-start py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return enabled
    ? <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle2 size={12} />Active</Badge>
    : <Badge variant="outline" className="text-muted-foreground gap-1"><AlertCircle size={12} />Inactive</Badge>;
}

function MaskedInput({ value, onChange, placeholder, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const isMasked = value === "••••••••";
  return (
    <div className="relative max-w-sm">
      <Input
        type={show || isMasked ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pr-10"
        {...props}
      />
      {!isMasked && (
        <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [smtp, setSmtp] = useState({ host: "", port: "587", user: "", pass: "", from: "", enabled: false });
  const [payment, setPayment] = useState({
    processor: "none",
    apiKey: "",
    appId: "",
    accessToken: "",
    locationId: "",
    mode: "sandbox",
    enabled: false,
    paypalClientId: "",
    paypalSecret: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
  });
  const [widget, setWidget] = useState({ code: "", enabled: false, placement: "contact" });

  useEffect(() => {
    if (!settings) return;
    setSmtp({
      host: settings.smtpHost ?? "",
      port: String(settings.smtpPort ?? 587),
      user: settings.smtpUser ?? "",
      pass: "",
      from: settings.smtpFrom ?? "",
      enabled: settings.smtpEnabled,
    });
    setPayment({
      processor: settings.paymentProcessor ?? "none",
      apiKey: settings.paymentApiKey ?? "",
      appId: settings.paymentAppId ?? "",
      accessToken: settings.paymentAccessToken ?? "",
      locationId: settings.paymentLocationId ?? "",
      mode: settings.paymentMode ?? "sandbox",
      enabled: settings.paymentEnabled,
      paypalClientId: settings.paypalClientId ?? "",
      paypalSecret: settings.paypalSecret ?? "",
      stripePublishableKey: settings.stripePublishableKey ?? "",
      stripeSecretKey: settings.stripeSecretKey ?? "",
    });
    setWidget({
      code: settings.bookingWidgetCode ?? "",
      enabled: settings.bookingWidgetEnabled,
      placement: settings.bookingWidgetPlacement ?? "contact",
    });
  }, [settings]);

  const save = async (section: "smtp" | "payment" | "widget") => {
    let body: Record<string, unknown>;
    if (section === "smtp") {
      body = { smtpHost: smtp.host, smtpPort: Number(smtp.port), smtpUser: smtp.user, smtpPass: smtp.pass, smtpFrom: smtp.from, smtpEnabled: smtp.enabled };
    } else if (section === "payment") {
      body = {
        paymentProcessor: payment.processor,
        paymentApiKey: payment.apiKey,
        paymentAppId: payment.appId,
        paymentAccessToken: payment.accessToken,
        paymentLocationId: payment.locationId,
        paymentMode: payment.mode,
        paymentEnabled: payment.enabled,
        paypalClientId: payment.paypalClientId,
        paypalSecret: payment.paypalSecret,
        stripePublishableKey: payment.stripePublishableKey,
        stripeSecretKey: payment.stripeSecretKey,
      };
    } else {
      body = { bookingWidgetCode: widget.code, bookingWidgetEnabled: widget.enabled, bookingWidgetPlacement: widget.placement };
    }

    await updateSettings.mutateAsync({ data: body }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Settings saved", description: "Changes have been applied." });
      },
      onError: () => {
        toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configure email, payments, and booking widget integrations.</p>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="smtp" className="gap-2"><Mail size={15} />Email</TabsTrigger>
          <TabsTrigger value="payment" className="gap-2"><CreditCard size={15} />Payments</TabsTrigger>
          <TabsTrigger value="widget" className="gap-2"><Video size={15} />Booking Widget</TabsTrigger>
          <TabsTrigger value="account" className="gap-2"><UserCog size={15} />Account</TabsTrigger>
        </TabsList>

        {/* ── SMTP ── */}
        <TabsContent value="smtp">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg">Email (SMTP)</CardTitle>
                  <CardDescription className="mt-1">Used to send booking confirmations, progress updates, and notifications to parents.</CardDescription>
                </div>
                <StatusBadge enabled={smtp.enabled} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <FieldRow label="Enable email" hint="Toggle to activate outbound email sending.">
                <div className="flex items-center gap-3">
                  <Toggle checked={smtp.enabled} onChange={v => setSmtp(s => ({ ...s, enabled: v }))} label="Enable SMTP" />
                  <span className="text-sm text-muted-foreground">{smtp.enabled ? "On" : "Off"}</span>
                </div>
              </FieldRow>
              <FieldRow label="From address" hint="The email address that will appear as the sender.">
                <Input placeholder="bookings@thurrocktuitionacademy.co.uk" value={smtp.from} onChange={e => setSmtp(s => ({ ...s, from: e.target.value }))} />
              </FieldRow>
              <FieldRow label="SMTP host" hint="Your email provider's outgoing mail server.">
                <Input placeholder="smtp.yourmailprovider.com" value={smtp.host} onChange={e => setSmtp(s => ({ ...s, host: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Port" hint="Usually 587 (TLS) or 465 (SSL).">
                <Input placeholder="587" value={smtp.port} onChange={e => setSmtp(s => ({ ...s, port: e.target.value }))} className="max-w-[120px]" />
              </FieldRow>
              <FieldRow label="Username" hint="Usually your full email address.">
                <Input placeholder="bookings@thurrocktuitionacademy.co.uk" value={smtp.user} onChange={e => setSmtp(s => ({ ...s, user: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Password" hint="Your email account or app-specific password.">
                <MaskedInput placeholder="••••••••" value={smtp.pass} onChange={v => setSmtp(s => ({ ...s, pass: v }))} />
              </FieldRow>
              <div className="flex justify-end pt-4">
                <Button onClick={() => save("smtp")} disabled={updateSettings.isPending} className="bg-[#1B2B6B] hover:bg-[#243580] gap-2">
                  <Save size={16} />
                  {updateSettings.isPending ? "Saving…" : "Save Email Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PAYMENTS ── */}
        <TabsContent value="payment">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg">Payment Processor</CardTitle>
                  <CardDescription className="mt-1">Accept online payments via Square, PayPal, or Stripe.</CardDescription>
                </div>
                <StatusBadge enabled={payment.enabled} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <FieldRow label="Enable payments" hint="Toggle to activate the payment integration on the website.">
                <div className="flex items-center gap-3">
                  <Toggle checked={payment.enabled} onChange={v => setPayment(s => ({ ...s, enabled: v }))} label="Enable payments" />
                  <span className="text-sm text-muted-foreground">{payment.enabled ? "On" : "Off"}</span>
                </div>
              </FieldRow>
              <FieldRow label="Processor" hint="Choose your payment provider.">
                <select
                  value={payment.processor}
                  onChange={e => setPayment(s => ({ ...s, processor: e.target.value }))}
                  className="w-full max-w-xs border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30"
                >
                  <option value="none">Not configured</option>
                  <option value="square">Square</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </FieldRow>
              <FieldRow label="Mode" hint="Use sandbox for testing. Switch to live when ready to accept real payments.">
                <div className="flex gap-3">
                  {["sandbox", "live"].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayment(s => ({ ...s, mode: m }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${payment.mode === m ? "bg-[#1B2B6B] text-white border-[#1B2B6B]" : "bg-background border-border text-muted-foreground hover:border-[#1B2B6B]/40"}`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </FieldRow>

              {/* Square fields */}
              {payment.processor === "square" && (
                <>
                  <FieldRow label="Application ID" hint="Production Application ID from your Square Developer dashboard.">
                    <Input placeholder="sq0idp-xxxxxxxxxxxxxxxxxxxx" value={payment.appId} onChange={e => setPayment(s => ({ ...s, appId: e.target.value }))} className="max-w-sm font-mono text-xs" />
                  </FieldRow>
                  <FieldRow label="Access Token" hint="Production Access Token from Square Developer → OAuth → Production.">
                    <MaskedInput placeholder="EAAAl…" value={payment.accessToken} onChange={v => setPayment(s => ({ ...s, accessToken: v }))} />
                  </FieldRow>
                  <FieldRow label="Location ID" hint="Your Square Location ID (Square Dashboard → Locations).">
                    <Input placeholder="LXXXXXXXXXXXXXXXXX" value={payment.locationId} onChange={e => setPayment(s => ({ ...s, locationId: e.target.value }))} className="max-w-sm font-mono text-xs" />
                  </FieldRow>
                </>
              )}

              {/* PayPal fields */}
              {payment.processor === "paypal" && (
                <>
                  <FieldRow label="Client ID" hint="From PayPal Developer Dashboard → My Apps & Credentials → Live.">
                    <Input placeholder="AXxxxxxxxxxxxxxxxxxxxxxxxxx" value={payment.paypalClientId} onChange={e => setPayment(s => ({ ...s, paypalClientId: e.target.value }))} className="max-w-sm font-mono text-xs" />
                  </FieldRow>
                  <FieldRow label="Client Secret" hint="Your PayPal app client secret (live credentials).">
                    <MaskedInput placeholder="EKxxxxxxxxxxxxxxxxxxxxxxxxx" value={payment.paypalSecret} onChange={v => setPayment(s => ({ ...s, paypalSecret: v }))} />
                  </FieldRow>
                </>
              )}

              {/* Stripe fields */}
              {payment.processor === "stripe" && (
                <>
                  <FieldRow label="Publishable Key" hint="Starts with pk_live_… — safe to use in the browser.">
                    <Input placeholder="pk_live_…" value={payment.stripePublishableKey} onChange={e => setPayment(s => ({ ...s, stripePublishableKey: e.target.value }))} className="max-w-sm font-mono text-xs" />
                  </FieldRow>
                  <FieldRow label="Secret Key" hint="Starts with sk_live_… — keep this private, never share it.">
                    <MaskedInput placeholder="sk_live_…" value={payment.stripeSecretKey} onChange={v => setPayment(s => ({ ...s, stripeSecretKey: v }))} />
                  </FieldRow>
                </>
              )}

              {payment.processor !== "none" && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Only enter <strong>production/live</strong> credentials. Test credentials are for development only and will not process real payments.
                </div>
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={() => save("payment")} disabled={updateSettings.isPending} className="bg-[#1B2B6B] hover:bg-[#243580] gap-2">
                  <Save size={16} />
                  {updateSettings.isPending ? "Saving…" : "Save Payment Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── BOOKING WIDGET ── */}
        <TabsContent value="widget">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg">Booking Widget</CardTitle>
                  <CardDescription className="mt-1">Paste your Zoom Scheduler, Calendly, Teams Bookings, or any other embed code. It will appear live on the pages you choose.</CardDescription>
                </div>
                <StatusBadge enabled={widget.enabled} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <FieldRow label="Enable widget" hint="Show the booking widget on the website.">
                <div className="flex items-center gap-3">
                  <Toggle checked={widget.enabled} onChange={v => setWidget(s => ({ ...s, enabled: v }))} label="Enable widget" />
                  <span className="text-sm text-muted-foreground">{widget.enabled ? "On — visible on site" : "Off — hidden from site"}</span>
                </div>
              </FieldRow>
              <FieldRow label="Show on" hint="Choose where the booking widget appears on the public website.">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "contact", label: "Contact page" },
                    { value: "homepage", label: "Homepage" },
                    { value: "both", label: "Both pages" },
                    { value: "popup", label: "Popup button" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setWidget(s => ({ ...s, placement: value }))}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors text-center ${widget.placement === value ? "bg-[#1B2B6B] text-white border-[#1B2B6B]" : "bg-background border-border text-muted-foreground hover:border-[#1B2B6B]/40"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FieldRow>
              <FieldRow label="Embed code" hint="Paste the full embed code from Zoom, Calendly, Teams Bookings, or any similar service. Supports both <iframe> and <script> tags.">
                <textarea
                  value={widget.code}
                  onChange={e => setWidget(s => ({ ...s, code: e.target.value }))}
                  rows={8}
                  placeholder={"<!-- Paste your Zoom / Calendly / Teams embed code here -->\n<iframe src=\"https://...\" width=\"100%\" height=\"500\"></iframe>"}
                  className="w-full border border-border rounded-xl px-4 py-3 text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1B2B6B]/30 focus:border-[#1B2B6B] transition-all resize-y"
                />
              </FieldRow>
              <div className="mt-2 p-4 bg-[#1B2B6B]/5 border border-[#1B2B6B]/15 rounded-xl text-xs text-muted-foreground leading-relaxed">
                <strong className="text-[#1B2B6B]">How to get your Zoom embed code:</strong> In Zoom, go to <em>Scheduler → Settings → Embed</em> and copy the iframe or script snippet. Paste it into the box above and hit Save. The widget will appear live on the selected page(s) straight away.
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => save("widget")} disabled={updateSettings.isPending} className="bg-[#1B2B6B] hover:bg-[#243580] gap-2">
                  <Save size={16} />
                  {updateSettings.isPending ? "Saving…" : "Save Widget Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ACCOUNT ── */}
        <TabsContent value="account">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
