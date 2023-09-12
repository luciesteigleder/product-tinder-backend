import db from "./db.mjs";
import { Category, categorySchema } from "./models/Category.mjs"

const allCat = [
  "Fruits",
  "Vegetables",
  "Cereal",
  "Meat",
  "Fish",
  "Seafood",
  "Dairy",
  "Herbs",
  "Wine",
  "Beverages",
  "Consumer Goods",
  "Juice",
  "Baked Goods",
  "Bread",
  "Clothing",
  "Crockery",
  "Cutlery",
  "Furniture",
  "Linen",
  "Decoration",
  "Art",
  "Tools",
  "Books",
  "Delivery",
];

const insertCat = () => {
    allCat.forEach(cat => {
          Category.create({
            category_name: cat,
            category_description: "description",
            category_logo: "placeholder_url"    
        })
    });
}

// insertCat()