import axios from "axios";
import FormData from "form-data";
import formidable from "formidable";
import fs from "node:fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Gunakan metode POST"
    });
  }

  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: err.message
        });
      }

      const file = files.file?.[0] || files.file;

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "File tidak ditemukan"
        });
      }

      const formData = new FormData();

      formData.append("reqtype", "fileupload");

      formData.append(
        "fileToUpload",
        fs.createReadStream(file.filepath),
        {
          filename: file.originalFilename
        }
      );

      const response = await axios.post(
        "https://catbox.moe/user/api.php",
        formData,
        {
          headers: formData.getHeaders()
        }
      );

      return res.status(200).json({
        status: true,
        url: response.data
      });
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message
    });
  }
}
