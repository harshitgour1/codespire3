import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to EKOS</CardTitle>
          <CardDescription>Sign in to your enterprise workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
          </div>
          <Button className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    </div>
  );
}
