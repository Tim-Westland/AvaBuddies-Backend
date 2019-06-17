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


UserSchema.statics.getModel = async (id) => {
  let data = await UserModel.find(id)
    .populate('tags').select('-password').exec()
    .then((result) => {
      return result
    }).catch((err) => {
      return {error: err.message};
    });
  return data;
}


UserSchema.statics.updateModel = async (id, model) => {
  let data = await UserModel.updateOne({ _id: id }, model)
    .exec().then(function (result) {
      return result;
    }).catch(function (err) {
      return {error: err.message};
    });
  return data;
}

UserSchema.statics.deleteModel = async (id) => {
  var data = await UserModel.deleteOne({_id: id})
  .exec()
  .then(function (result) {
    return result;
  }).catch(function (err) {
    return {error: err.message};
  });
  return data;
}


var UserModel = module.exports = mongoose.model('User', UserSchema);
