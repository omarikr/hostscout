import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About HostScout",
  description: "Learn about HostScout - Your trusted source for hosting reviews",
};

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">About HostScout</h1>
        <p className="text-xl text-muted-foreground">Your trusted source for hosting reviews</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What is HostScout?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              HostScout is a community-driven platform dedicated to providing honest, unbiased reviews of Discord-based hosting services. 
              We not only review hostings but also list free hostings to support more students. Our mission is to help individuals 
              and businesses make informed decisions when choosing a hosting service.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Browse hosting reviews from our community</li>
              <li>Read detailed experiences and ratings</li>
              <li>Share your own hosting experiences</li>
              <li>Engage with the community through comments and discussions</li>
              <li>Help others by voting on helpful reviews</li>
              <li>Find free hosting options for students</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">All reviews are from real users with verified experiences</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">Built by the community, for the community</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Student Support</h3>
                <p className="text-muted-foreground">Listing free hosting options to support students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Have questions or suggestions? Reach out to us through our community channels or contact our admin team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
