import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms and Conditions - HostScout",
  description: "Terms and Conditions for HostScout",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms and Conditions</h1>
        <p className="text-xl text-muted-foreground">Please read these terms carefully before using HostScout</p>
      </div>

      <div className="space-y-6">
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing and using HostScout, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Data Loss Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We do not guarantee no data loss as our infrastructure might not be stable. Users are responsible for backing up their own data. HostScout is not liable for any data loss or corruption that may occur.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>3. Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>No racism or discriminatory language in comments or reviews</li>
              <li>No hate speech, harassment, or threatening behavior</li>
              <li>No spam or self-promotion without disclosure</li>
              <li>Respect other users and their opinions</li>
              <li>Provide honest and accurate reviews based on real experiences</li>
              <li>No sharing of personal information without consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Content Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HostScout reserves the right to moderate, edit, or remove any content that violates these terms. Users who repeatedly violate these guidelines may have their accounts suspended or banned.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>5. Account Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Provide accurate and truthful information when registering</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>6. Service Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HostScout is provided on an "as is" basis without warranties of any kind. We do not guarantee uninterrupted or error-free service. We reserve the right to modify, suspend, or discontinue the service at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HostScout and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our service.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>8. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>9. Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about these Terms and Conditions, please contact us through our community channels.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
