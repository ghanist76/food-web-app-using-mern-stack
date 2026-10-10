const restaurantCatalog = [
  { id: "r1", name: "Urban Bites", cuisine: "Burgers • Pizza • Wraps", rating: 4.8, eta: "20-30 min", deliveryFee: 29, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80" },
  { id: "r2", name: "Spice Route", cuisine: "Indian • Tandoori • Curries", rating: 4.9, eta: "25-35 min", deliveryFee: 35, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
  { id: "r3", name: "Crispy Corner", cuisine: "Snacks • Fries • Sides", rating: 4.6, eta: "15-25 min", deliveryFee: 19, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" },
  { id: "r4", name: "Wok & Bowl", cuisine: "Chinese • Noodles • Rice", rating: 4.7, eta: "30-40 min", deliveryFee: 32, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80" },
  { id: "r5", name: "Sweet Crave", cuisine: "Desserts • Cakes • Shakes", rating: 4.8, eta: "20-25 min", deliveryFee: 20, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80" },
  { id: "r6", name: "Sip & Savor", cuisine: "Fresh Juice • Mocktails • Coffee", rating: 4.5, eta: "10-20 min", deliveryFee: 15, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80" }
];

const offerCombos = [
  { id: "deal-1", title: "Burger Bonanza", description: "Buy any 2 burgers and get 20% off", badge: "20% OFF", trigger: "burger" },
  { id: "deal-2", title: "Family Feast", description: "Order 3+ items and save 12% on the total basket", badge: "12% OFF", trigger: "bundle" },
  { id: "deal-3", title: "Pizza + Soda", description: "Add a pizza and soft drink for a combo discount", badge: "₹120 OFF", trigger: "pizza" },
  { id: "deal-4", title: "Express Delivery", description: "Free delivery when your basket crosses ₹499", badge: "FREE DELIVERY", trigger: "delivery" }
];

const foodBlueprints = [
  { category: "FastFood", baseName: "Classic Burger", price: 189, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Grilled patty with melted cheese, crisp lettuce, and smoky sauce." },
  { category: "FastFood", baseName: "Paneer Burger", price: 219, image: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Crispy paneer patty layered with fresh veggies and tangy aioli." },
  { category: "FastFood", baseName: "Pepperoni Pizza", price: 349, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Loaded with pepperoni, mozzarella, and a rich tomato base." },
  { category: "FastFood", baseName: "Margherita Pizza", price: 289, image: "https://images.unsplash.com/photo-1548365328-9f547fb9587c?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Classic cheese pizza with basil and a golden crust." },
  { category: "FastFood", baseName: "Loaded Fries", price: 159, image: "https://images.unsplash.com/photo-1576106672527-a0d69021c4d5?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Crispy fries topped with seasoning and a creamy dip." },
  { category: "FastFood", baseName: "Chicken Wrap", price: 179, image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Soft wrap with juicy chicken, greens, and bold sauces." },
  { category: "Indian", baseName: "Butter Chicken", price: 329, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Tender chicken cooked in a creamy butter gravy." },
  { category: "Indian", baseName: "Paneer Tikka Masala", price: 289, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Smoky paneer cubes in a rich tomato and cashew sauce." },
  { category: "Indian", baseName: "Chicken Biryani", price: 319, image: "https://images.unsplash.com/photo-1651602671034-9c91db59f045?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Fragrant basmati rice layered with curry leaves and spices." },
  { category: "Indian", baseName: "Veg Biryani", price: 269, image: "https://images.unsplash.com/photo-1626697552845-29ad1a83d2c7?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Aromatic rice with vegetables, saffron, and herbs." },
  { category: "Indian", baseName: "Chole Bhature", price: 169, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Spiced chickpeas served with fluffy fried bread." },
  { category: "Indian", baseName: "Dal Makhani", price: 249, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Slow-cooked black lentils in creamy butter gravy." },
  { category: "Snacks", baseName: "Crispy Samosa", price: 89, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Golden pastry loaded with potato and spices." },
  { category: "Snacks", baseName: "Peri Peri Fries", price: 129, image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Crisp fries tossed with a tangy peri peri seasoning." },
  { category: "Snacks", baseName: "Veg Momos", price: 139, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Soft dumplings served with chili garlic dip." },
  { category: "Snacks", baseName: "Chicken Momos", price: 179, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Juicy chicken dumplings with a smoky sesame finish." },
  { category: "Snacks", baseName: "Garlic Bread", price: 149, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Crunchy toasted bread with garlic butter and herbs." },
  { category: "Chinese", baseName: "Chicken Hakka Noodles", price: 239, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Wok-tossed noodles with chicken, veggies, and soy flavors." },
  { category: "Chinese", baseName: "Veg Chowmein", price: 199, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Noodles tossed with cabbage, carrots, and spring onions." },
  { category: "Chinese", baseName: "Chicken Fried Rice", price: 229, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80", isVegetarian: false, description: "Stir-fried rice with chewy chicken and crunchy vegetables." },
  { category: "Chinese", baseName: "Veg Fried Rice", price: 189, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Fluffy rice with vegetables and savory sauces." },
  { category: "Chinese", baseName: "Manchurian Bowl", price: 219, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Crispy vegetable bites in a glossy Indo-Chinese sauce." },
  { category: "Desserts", baseName: "Chocolate Cake", price: 169, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Soft chocolate sponge layered with rich ganache." },
  { category: "Desserts", baseName: "Gulab Jamun", price: 109, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Soft dumplings soaked with cardamom-scented sugar syrup." },
  { category: "Desserts", baseName: "Brownie Sundae", price: 189, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Warm brownie topped with vanilla cream and chocolate sauce." },
  { category: "Desserts", baseName: "Vanilla Ice Cream", price: 99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Smooth vanilla scoop with a creamy classic finish." },
  { category: "Drinks", baseName: "Coca Cola", price: 79, image: "https://images.unsplash.com/photo-1622483767028-3f66f2b7420a?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Chilled fizzy cola in a classic cold can." },
  { category: "Drinks", baseName: "Lemonade", price: 99, image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Fresh citrus blend with a crisp refreshing finish." },
  { category: "Drinks", baseName: "Mango Lassi", price: 129, image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Creamy yogurt drink blended with ripe mango flavor." },
  { category: "Drinks", baseName: "Cold Coffee", price: 159, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", isVegetarian: true, description: "Smooth chilled coffee with a soft creamy texture." }
];

const foodPhotoIds = {
  FastFood: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1550317138-10000687a72b",
    "photo-1513104890138-7c749659a591",
    "photo-1548365328-9f547fb9587c",
    "photo-1576106672527-a0d69021c4d5",
    "photo-1613514785940-daed07799d9b",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1550547660-d9450f859349"
  ],
  Indian: [
    "photo-1603894584373-5ac82b2ae398",
    "photo-1631452180519-c014fe946bc7",
    "photo-1651602671034-9c91db59f045",
    "photo-1626697552845-29ad1a83d2c7",
    "photo-1604908176997-125f25cc6f3d",
    "photo-1547592180-85f173990554",
    "photo-1565557623262-b51c2513a641"
  ],
  Snacks: [
    "photo-1601050690597-df0568f70950",
    "photo-1541592106381-b31e9677c0e5",
    "photo-1526318896980-cf78c088247c",
    "photo-1559847844-5315695dadae",
    "photo-1504674900247-0877df9cc836"
  ],
  Chinese: [
    "photo-1512058564366-18510be2db19",
    "photo-1526318896980-cf78c088247c",
    "photo-1563245372-f21724e3856d",
    "photo-1569718212165-3a8278d5f624",
    "photo-1518779578993-ec3579fee39f"
  ],
  Desserts: [
    "photo-1578985545062-69928b1d9587",
    "photo-1551024601-bec78aea704b",
    "photo-1563805042-7684c019e1cb",
    "photo-1560008581-09826d1de69e",
    "photo-1488477181946-6428a0291777"
  ],
  Drinks: [
    "photo-1622483767028-3f66f2b7420a",
    "photo-1546173159-315724a31696",
    "photo-1577805947697-89e18249d767",
    "photo-1495474472287-4d71bcdd2085",
    "photo-1513558161293-cdaf765edc40"
  ]
};

const foodImages = Object.fromEntries(
  Object.entries(foodPhotoIds).map(([category, photoIds]) => [
    category,
    photoIds.map((photoId) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=85`)
  ])
);

function generateFoodCatalog() {
  const catalog = [];
  const size = 900;
  const flavorAddons = ["Classic", "House Special", "Chef's Pick", "Royal", "Crispy", "Smoky", "Loaded", "Signature", "Spicy", "Crunchy", "Creamy", "Fire Grilled"];
  const mealAddons = ["Combo", "Platter", "Family Pack", "Mini", "Supreme", "Ultimate", "Deluxe", "Fresh", "Double", "Triple"];

  for (let i = 0; i < size; i += 1) {
    const base = foodBlueprints[i % foodBlueprints.length];
    const suffix = mealAddons[(i + base.baseName.length) % mealAddons.length];
    const modifier = flavorAddons[(i * 3 + base.baseName.length) % flavorAddons.length];
    const restaurant = restaurantCatalog[i % restaurantCatalog.length];
    const basePrice = base.price + (i % 6) * 19 + (i % 4) * 7;
    const imageOptions = foodImages[base.category] || [base.image];
    const imageIndex = Math.floor(i / foodBlueprints.length) % imageOptions.length;

    catalog.push({
      name: `${modifier} ${base.baseName} ${suffix} #${String(i + 1).padStart(3, "0")}`.trim().replace(/\s+/g, " "),
      price: basePrice,
      category: base.category,
      restaurant: restaurant.name,
      rating: Number((4.4 + ((i % 9) * 0.06)).toFixed(1)),
      deliveryTime: `${15 + (i % 6) * 5}-${25 + (i % 7) * 10} min`,
      image: imageOptions[imageIndex],
      isVegetarian: base.isVegetarian || (i % 10 === 0),
      description: `${base.description} Packed fresh from ${restaurant.name}.`,
      badge: i % 5 === 0 ? "Best seller" : i % 7 === 0 ? "Chef special" : "Popular",
      offerTag: i % 9 === 0 ? "Deal saver" : ""
    });
  }

  return catalog;
}

const defaultFoods = generateFoodCatalog();

module.exports = { defaultFoods, restaurants: restaurantCatalog, offerCombos };
