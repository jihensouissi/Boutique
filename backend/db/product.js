/*import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      price: {
         type: Number,
         required: true,
         trim: true,
      },
      category: {
         type: String,
         required: true,
         trim: true,
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         required: true,
      },
      company: {
         type: String,
         required: true,
         trim: true,
      },

   },
   { timestamps: true }
);

export default mongoose.model("Product", productSchema);
*/
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  image: { type: String, default: "" },
  description: { type: String },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'products'
});

const Product = mongoose.model('Product', productSchema);

export default Product;