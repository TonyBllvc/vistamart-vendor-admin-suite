import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";

const UserWishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Premium Wireless Earbuds",
      price: 149.99,
      originalPrice: 199.99,
      image: "/placeholder.svg",
      inStock: true,
      rating: 4.5
    },
    {
      id: 2,
      name: "Gaming Mechanical Keyboard",
      price: 89.99,
      originalPrice: 129.99,
      image: "/placeholder.svg",
      inStock: true,
      rating: 4.7
    },
    {
      id: 3,
      name: "4K Webcam",
      price: 199.99,
      originalPrice: 249.99,
      image: "/placeholder.svg",
      inStock: false,
      rating: 4.3
    },
    {
      id: 4,
      name: "Portable SSD 1TB",
      price: 119.99,
      originalPrice: 159.99,
      image: "/placeholder.svg",
      inStock: true,
      rating: 4.8
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">{wishlistItems.length} items saved for later</p>
        </div>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg bg-gray-100"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
                {!item.inStock && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({item.rating})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-affiliate-primary">${item.price}</span>
                  <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1 bg-affiliate-primary hover:bg-affiliate-primary/90"
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.inStock ? 'Add to Cart' : 'Notify Me'}
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserWishlist;