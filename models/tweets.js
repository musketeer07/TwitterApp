let mongoose=require('mongoose');
var Schema = mongoose.Schema;

const TweetSchema=new Schema({
    body: { type: String, default: "", trim: true, maxlength: 280},
    user: { type: Schema.ObjectId, ref: "User" },
    comments: [
        {
            body: { type: String, default: "", maxlength: 280},
            user: { type: Schema.ObjectId, ref: "User" },
            commenterName: { type: String, default: "" },
            commenterPicture: { type: String, default: ""},
            favorites: [{ type: Schema.ObjectId, ref: "User" }],
            favoritesCount: Number,
            createdAt: { type: Date, default: Date.now }
        },
    ],
    favorites: [{ type: Schema.ObjectId, ref: "User" }],
    favoritesCount: Number,
    createdAt: { type: Date, default: Date.now }
}, {usePushEach: true});

// // Pre save hook
// TweetSchema.pre("save", function(next) {
//     if (this.favorites.indexOf(user) === -1) {
//         this.favorites.push(user);
//         this.favoritesCount = this.favorites.length;
//
//     } else {
//         this.favorites.splice(this.favorites.indexOf(user), 1);
//         this.favoritesCount = this.favorites.length;
//
//     }
//     next();
// });

module.exports = mongoose.model("Tweet", TweetSchema);