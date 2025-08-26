import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Users, 
  Store,
  ArrowRight,
  Shield,
  TrendingUp,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Complete eCommerce Solution",
      description: "Full-featured multivendor marketplace with cart, checkout, and order management."
    },
    {
      icon: Users,
      title: "Advanced Admin Panel",
      description: "Comprehensive dashboard with analytics, user management, and brand controls."
    },
    {
      icon: Store,
      title: "Vendor Management",
      description: "Powerful vendor dashboard with product upload, revenue tracking, and analytics."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with modern security practices and reliable infrastructure."
    }
  ];

  const stats = [
    { label: "Active Users", value: "12K+", color: "text-primary" },
    { label: "Products", value: "2.1K+", color: "text-secondary" },
    { label: "Vendors", value: "234", color: "text-success" },
    { label: "Orders", value: "5.6K+", color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Badge className="bg-white/20 text-white">New</Badge>
              <span className="text-sm">Advanced Analytics Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Vista<span className="text-secondary">Mart</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              The ultimate multivendor ecommerce platform with powerful admin and vendor management systems
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3"
              >
                <Link to="/admin">
                  Admin Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                <Link to="/vendor">
                  Vendor Panel
                  <Store className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Your Marketplace
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology and designed for scalability, performance, and user experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Choose your role and start exploring the powerful features of VistaMart.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Card className="p-6 bg-white text-foreground max-w-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>
                  Manage the entire marketplace with comprehensive admin tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/admin">
                    Enter Admin Panel
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white text-foreground max-w-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Store className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Vendor Access</CardTitle>
                <CardDescription>
                  Manage your products, orders, and grow your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/vendor">
                    Enter Vendor Panel
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VM</span>
            </div>
            <span className="text-2xl font-bold">VistaMart</span>
          </div>
          <p className="text-muted-foreground">
            Built with modern technologies for the future of ecommerce.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;