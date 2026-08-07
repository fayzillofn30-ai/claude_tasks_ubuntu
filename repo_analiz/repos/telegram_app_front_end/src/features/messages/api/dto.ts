import Joi from "joi";

export const createMessageSchema = Joi.object({
  chatId: Joi.string()
    .uuid()
    .required()
    .description("Chat ID (UserChat jadvalidan)")
    .example("b8f1d9c2-3456-4a21-a7ef-1234567890ab"),

  text: Joi.string()
    .optional()
    .description("Matn xabari")
    .example("Salom, yaxshimisiz?"),

  senderId: Joi.string()
    .optional()
    .description("Yuboruvchi foydalanuvchi ID")
    .example("a1b2c3d4-5678-90ab-cdef-1234567890ab"),
});


export const createGroupMessageSchema = Joi.object({
  chatId: Joi.string()
    .uuid()
    .required()
    .description("Group Chat ID")
    .example("c7e8f1a2-7890-1234-bcde-9876543210ab"),

  senderId: Joi.string()
    .uuid()
    .required()
    .description("Yuboruvchi User ID")
    .example("a1b2c3d4-5678-90ab-cdef-1234567890ab"),

  text: Joi.string()
    .optional()
    .description("Matnli habar")
    .example("Bugun yig‘ilish soat 7 da."),

  files: Joi.array()
    .items(Joi.any())
    .optional()
    .description("Fayllar")
    .example(["file1.pdf", "file2.docx"]),
});


export const createChannelMessageSchema = Joi.object({
  chatId: Joi.string()
    .uuid()
    .required()
    .description("Channel Chat ID")
    .example("e3f2a1b4-5678-4321-bcde-0987654321ab"),

  senderId: Joi.string()
    .uuid()
    .required()
    .description("Yuboruvchi User ID")
    .example("a1b2c3d4-5678-90ab-cdef-1234567890ab"),

  text: Joi.string()
    .optional()
    .description("Matn")
    .example("Bugungi yangilik: yangi funksiya ishga tushdi!"),

  docs: Joi.array()
    .items(Joi.any())
    .optional()
    .description("Hujjatlar")
    .example(["report.pdf", "manual.docx"]),
});
