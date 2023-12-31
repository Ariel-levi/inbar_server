const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: String,
  gender: String,
  email: String,
  phone: String,
  height: String,
  yishuv: String,
  region: String,
  type_of_residence: String,
  family_status: String,
  there_are_children: String,
  current_occupation: String,
  religious_level: String,
  body_structure: String,
  ethnicity: String,
  national_or_military_service: String,
  details: String,
  education: String,
  educational_framework: String,
  about_my_family: String,
  disability_Physical: Boolean,
  disability_intellectual: Boolean,
  disability_developmental: Boolean,
  disability_mentally_challenged: Boolean,
  disability_on_the_spectrum: Boolean,
  type_of_disability_info: String,
  independent_disability: String,
  interest: String,
  standing_out_features: String,
  hobbys: String,
  age_min: String,
  age_max: String,
  in_terms_of_character: String,
  religiously: String,
  in_terms_of_appearance: String,
  seek_for_disability_doesnt_matter: Boolean,
  seek_for_disability_Physical: Boolean,
  seek_for_disability_intellectual: Boolean,
  seek_for_disability_developmental: Boolean,
  seek_for_disability_mentally_challenged: Boolean,
  seek_for_disability_on_the_spectrum: Boolean,
  seek_for_type_of_disability_info: String,
  questions_on_your_own: String,
  additional_notes: String,
  contact_name: String,
  contact_phone: String,
  contact_family_relationship: String,
  img_url: String,
  role: {
    type: String,
    default: "user",
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  birthDate: String,
});

exports.UserModel = mongoose.model("users", userSchema);

exports.validateUser = (_bodyReq) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(150).email().required(),
    phone: Joi.string().min(2).max(300).required(),
    gender: Joi.string().min(2).max(300).required(),
    height: Joi.string().min(2).max(300).required(),
    yishuv: Joi.string().min(2).max(300).required(),
    region: Joi.string().min(2).max(300).required(),
    birthDate: Joi.string().min(2).max(300).required(),
    type_of_residence: Joi.string().min(2).max(300).required(),
    family_status: Joi.string().min(2).max(300).required(),
    there_are_children: Joi.string().min(2).max(300).required(),
    current_occupation: Joi.string().min(2).max(300).required(),
    religious_level: Joi.string().min(2).max(300).required(),
    body_structure: Joi.string().min(2).max(300).allow(null, ""),
    ethnicity: Joi.string().min(2).max(300).allow(null, ""),
    national_or_military_service: Joi.string().min(2).max(300).required(),
    details: Joi.string().min(2).max(300).allow(null, ""),
    education: Joi.string().min(2).max(300).required(),
    educational_framework: Joi.string().min(2).max(300).required(),
    about_my_family: Joi.string().min(2).max(300).allow(null, ""),
    disability_Physical: Joi.boolean().required(),
    disability_intellectual: Joi.boolean().required(),
    disability_developmental: Joi.boolean().required(),
    disability_mentally_challenged: Joi.boolean().required(),
    disability_on_the_spectrum: Joi.boolean().required(),
    type_of_disability_info: Joi.string().min(2).max(300).required(),
    independent_disability: Joi.string().min(2).max(300).required(),
    interest: Joi.string().min(2).max(300).allow(null, ""),
    standing_out_features: Joi.string().min(2).max(300).allow(null, ""),
    hobbys: Joi.string().min(2).max(300).allow(null, ""),
    age_min: Joi.string().min(2).max(300).required(),
    age_max: Joi.string().min(2).max(300).required(),
    in_terms_of_character: Joi.string().min(2).max(300).allow(null, ""),
    religiously: Joi.string().min(2).max(300).allow(null, ""),
    in_terms_of_appearance: Joi.string().min(2).max(300).allow(null, ""),
    seek_for_disability_doesnt_matter: Joi.boolean().required(),
    seek_for_disability_Physical: Joi.boolean().required(),
    seek_for_disability_intellectual: Joi.boolean().required(),
    seek_for_disability_developmental: Joi.boolean().required(),
    seek_for_disability_mentally_challenged: Joi.boolean().required(),
    seek_for_disability_on_the_spectrum: Joi.boolean().required(),
    seek_for_type_of_disability_info: Joi.string()
      .min(2)
      .max(300)
      .allow(null, ""),
    questions_on_your_own: Joi.string().min(2).max(300).required(),
    additional_notes: Joi.string().min(2).max(300).allow(null, ""),
    contact_name: Joi.string().min(2).max(300).required(),
    contact_phone: Joi.string().min(2).max(300).required(),
    contact_family_relationship: Joi.string().min(2).max(300).required(),
    img_url: Joi.string().min(2).max(300).allow(null, ""),
  });
  return joiSchema.validate(_bodyReq);
};
