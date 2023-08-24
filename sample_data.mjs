// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   profile_type: {
//     type: Boolean, //do we really ant boolean ? Yes-no
//     required: true,
//   },
// });

// const shopSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   shop_location: {
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//   },
//   shop_name: {
//     type: String,
//     required: true,
//   },
//   shop_contact: { address: String, phone: Number },
//   description: {
//     type: String,
//     required: true,
//   },
//   picture: {
//     type: String, // to be confirmed, either saved on the server or on mongodb
//   },
//   language: {
//     type: String,
//     required: true,
//   },
//   fav_prov: {
//     type: [mongoose.Schema.Types.ObjectId],
//   },
// });

// const provSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   prov_location: {
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//   },
//   prov_name: {
//     type: String,
//     required: true,
//   },
//   prov_contact: { address: String, phone: Number },
//   description: {
//     type: String,
//     required: true,
//   },
//   picture: {
//     type: String, // to be confirmed, either saved on the server or on mongodb
//   },
//   language: {
//     type: String,
//     required: true,
//   },
//   score: {
//     type: [mongoose.Schema.Types.ObjectId],
//   },
//   price_score: {
//     type: [mongoose.Schema.Types.ObjectId],
//   },
//   testimonials: {
//     type: [mongoose.Schema.Types.ObjectId],
//   },
// });

// const categorySchema = new mongoose.Schema({
//   category_name: {
//     type: String,
//   },
//   category_description: {
//     type: String,
//   },
//   category_logo: {
//     type: String, // to be confirmed, either saved on the server or on mongodb
//   },
// });

// const tagSchema = new mongoose.Schema({
//   tag_name: {
//     type: String,
//     required: true,
//   },
// });

// const resultSchema = new mongoose.Schema({
//   shop_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Shop",
//     required: true,
//   },
//   prov_id: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Prov",
//       required: true,
//     },
//   ],
// });

// const conversationSchema = new mongoose.Schema({
//   shop_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Shop",
//     required: true,
//   },
//   prov_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Prov",
//     required: true,
//   },
//   messages: [
//     {
//       message_author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       message_text: {
//         type: String,
//         required: true,
//       },
//       message_date: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// userSchema.post('save', async doc => {
//   console.log("test middleware");

// })

// const User = mongoose.model("User", userSchema);

// const Prov = mongoose.model("Prov", provSchema);

// const Shop = mongoose.model("Shop", shopSchema);

// const Category = mongoose.model("Category", categorySchema);

// const Tag = mongoose.model("Tag", tagSchema);

// const Result = mongoose.model("Result", resultSchema);

// const Conversation = mongoose.model("Conversation", conversationSchema);

// // Conversation.findById(conversationId)
// //   .then(conversation => {
// //     conversation.messages.push({
// //       message_author: 'user_id_value',
// //       message_text: 'Hello',
// //       message_date: new Date(),
// //     });

// //     return conversation.save();
// //   })
// //   .then(updatedConversation => {
// //     console.log('Updated conversation:', updatedConversation);
// //   })
// //   .catch(error => {
// //     console.error('Error updating conversation:', error);
// //   });

// export { User, Shop, Prov, Category, Tag, Result, Conversation, userSchema };

// // const newUser = new User({
// //     username: "username2",
// //     password: "password123",
// //     email: "email@test.com",
// //     profile_type: true,
// //   });

// // const newShop = new Shop({
// //     user_id: "64e5cd951054eb8907d0ef16",
// //     shop_location: { coordinates: ["50.84599904406658", "4.3616340030541405"] },
// //     shop_name: "nameShop1",
// //     shop_contact: {
// //       address: "1 rue de Bruxelles",
// //       phone: "0123456789",
// //     },
// //     description: "A nice shop",
// //     picture: "picture/url",
// //     language: "FR",
// //   });

// // const newProv = new Prov({
// //   user_id,
// //   prov_location: { coordinates },
// //   prov_name,
// //   prov_contact: {
// //     address,
// //     phone,
// //   },
// //   description,
// //   picture,
// //   language,
// // });

// // const newCategory = new Category({
// //     category_name: "Vegetables",
// //     category_description: "everything that is green",
// //     category_logo: "logo/url",
// //   });

// // const newTag = new Tag({
// //   tag_name: "carrots",
// // });

// // const newResults = new Result({
// //   shop_id: "64e5dcf265667807ecc73bb0",
// //   prov_id: "64e5dcf265667807ecc73bb0",
// // });

// //to add a essage to a conversation :

// // Conversation.findById("64e5ecf3ce8845889efb0ac0")
// //     .then((conversation) => {
// //       conversation.messages.push({
// //         message_author: "64e5cc5116fba46e46d6e04f",
// //         message_text: "Hello",
// //         message_date: new Date(),
// //       });
// //       return conversation.save();
// //     })
// //     .then((updatedConversation) => {
// //       console.log("Updated conversation:", updatedConversation);
// //     })
// //     .catch((error) => {
// //       console.error("Error updating conversation:", error);
// //     });

// // const newProv = new Prov({
// //   user_id: "64e5cd951054eb8907d0ef16",
// //   prov_location: { coordinates: ["50.84599904406658", "4.3616340030541405"] },
// //   prov_name: "nameProv2",
// //   prov_contact: {
// //     address: "1 rue de Bruxelles",
// //     phone: "0123456789",
// //   },
// //   description: "A nice shop",
// //   picture: "picture/url",
// //   language: "FR",
// // });
