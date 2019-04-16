const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    aboutme: {
        type: String,

    },
    sharelocation: {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    image: {
        type: String,
        default: ''
    }

});

UserSchema.pre('save', async function (next) {
    if (this.isNew) {
        const user = this;
        this.password = await bcrypt.hash(this.password, 10);
    } else {
        //console.log("Updating user")
    }
    next();
});

UserSchema.methods.isValidPassword = async function (password) {
    const hash = await bcrypt.hash(this.password, 10);
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
