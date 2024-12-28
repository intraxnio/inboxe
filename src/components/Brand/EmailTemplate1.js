import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useSelector } from "react-redux";



const EmailTemplate = ({ campaignTitle, tags, from, subject, previewText}) => {
  const [title, setTitle] = useState("Title Lorem Ipsum");
  const [description, setDescription] = useState("Description Lorem Ipsum");
  const [footerText, setFooterText] = useState("Brand Name");
  const [headerImage, setHeaderImage] = useState(null);
  const [footerLogo, setFooterLogo] = useState(null);
  const [buttonText, setButtonText] = useState("Click Me");
  const [imageUrl, setImageUrl] = useState("");
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const user = useSelector((state) => state.brandUser);
  const [socialImageFile, setSocialImageFile] = useState(null);
  const [buttonStyles, setButtonStyles] = useState({
    backgroundColor: "#257180",
    color: "white",
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      ['link'],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const handleImageUpload = (file, type) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "header") setHeaderImage(reader.result);
        if (type === "footer") setFooterLogo(reader.result);
      };
      reader.readAsDataURL(file);
      setSocialImageFile(file);

    }
  };


  const handleButtonStylesChange = (key, value) => {
    setButtonStyles((prev) => ({ ...prev, [key]: value }));
  };

  const generateImageUrl = async() => {


const FormData = require("form-data");
const formData = new FormData();
formData.append("socialImage", socialImageFile); // file is the uploaded image object

     try {
      const res = await axios.post(baseUrl + "/upload-image-aws-s3", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if(res.data.success){
        const uploadedUrl = res.data.url; // Get URL directly
        setImageUrl(uploadedUrl); // Update state for consistency
        const htmlCode = await generateHTML(uploadedUrl);

         try {
              const emailResponse = await axios.post(baseUrl + "/create-campaign", {
                user_id: user.user_id,
                htmlCode : htmlCode,
                campaignTitle :campaignTitle,
                tags :tags,
                from :from,
                subject :subject,
                previewText :previewText,
                
              });
              if(emailResponse.data.sent){

                alert('Campaign created');

              }

            } catch (error) {
              console.error(error);
            } finally {
            }

      }
          // setLoading(false);
        } catch (error) {
          console.error(error);
        } finally {
          // setLoading(false); // Ensure loading is stopped even if there is an error
        }

  }



  const generateHTML = async (uploadedUrl) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { width: 600px; margin: auto; }
              .header img { width: 100%; height: auto; object-fit: cover; }
              .title { text-align: center; font-size: 24px; color: #333; margin: 20px 0; }
              .description { text-align: left; color: #555; font-size: 16px; line-height: 1.5; }
               .button { text-align: center; margin: 20px 0; }
              .button a { 
                text-decoration: none; 
                background-color: ${buttonStyles.backgroundColor}; 
                color: ${buttonStyles.color}; 
                padding: 12px 12px 12px 12px; 
                border-radius: 26px; 
                display: inline-block; 
                font-size: 16px; 
              }
              .footer img { width: 60px; height: 60px; object-fit: cover; margin-right: 10px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="${uploadedUrl || "https://via.placeholder.com/600x200"}" alt="Header Image" />
              </div>
              <div class="title">${title}</div>
              <div class="description">${description}</div>
              <div class="footer" style="display: flex; align-items: center;">
                  <img src="${footerLogo || "https://via.placeholder.com/60x60"}" alt="Footer Logo" />
                  <div>${footerText}</div>
              </div>
          </div>
      </body>
      </html>
    `;
    console.log(html);
    return html;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Editor Section */}
      <div style={{ flex: "1", marginRight: "20px" }}>
        <h2>Design Email</h2>

        {/* Header Image Upload */}
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleImageUpload(e.dataTransfer.files[0], "header");
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("headerUpload").click()}
          style={{
            width: "100%",
            height: "300px",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            backgroundImage: headerImage ? `url(${headerImage})` : "none",
            backgroundSize: "cover",
          }}
        >
          {!headerImage && <p>Drag & Drop Header Image or Click to Upload</p>}
          <input
            id="headerUpload"
            name="socialImage"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files[0], "header")}
          />
        </div>

        {/* Title Editor */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Title:
          </label>
          <ReactQuill
        value={title}
        onChange={setTitle}
        theme="snow"
        placeholder="Enter Title"
        modules={modules} // Color tool added
        style={{ width: "100%" }}
      />
        </div>

        {/* Description Editor */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Description:
          </label>
          <ReactQuill
        value={description}
        onChange={setDescription}
        theme="snow"
        placeholder="Enter Description"
        modules={modules} // Color tool added
        style={{ width: "100%", height: "120px" }}
      />
        </div>

         {/* Button Text Editor */}
       <div style={{ marginBottom: "20px", marginTop: "60px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Button Text:</label>
          <ReactQuill
            value={buttonText}
            onChange={setButtonText}
            theme="snow"
            placeholder="Enter Button Text"
            modules={modules}
            style={{ width: "100%" }}
          />
        </div>

         {/* Button Styles */}
         <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}>
            Button Background Color:
          </label>
          <input
            type="color"
            value={buttonStyles.backgroundColor}
            onChange={(e) => handleButtonStylesChange("backgroundColor", e.target.value)}
            style={{ width: "100%", height: "40px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>

        {/* Footer Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            border: "1px dashed #ccc",
            padding: "10px",
            borderRadius: "5px",
            marginTop : '44px'
          }}
        >
          {/* Footer Logo */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleImageUpload(e.dataTransfer.files[0], "footer");
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("footerUpload").click()}
            style={{
              width: "60px",
              height: "60px",
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: footerLogo ? `url(${footerLogo})` : "none",
              backgroundSize: "cover",
              marginRight: "10px",
            }}
          >
            {!footerLogo && <p>Brand Logo</p>}
            <input
              id="footerUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e.target.files[0], "footer")}
            />
          </div>

          {/* Footer Text Editor */}
          <div style={{ flexGrow: 1 }}>
            <ReactQuill
              value={footerText}
              onChange={setFooterText}
              theme="snow"
              placeholder="Brand Name"
              modules={modules}
              style={{
                width: "100%",
              }}
            />


          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={generateImageUrl}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginTop: "20px",
          }}
        >
          Save & Generate HTML
        </button>
      </div>

      {/* Preview Section */}
      <div
        style={{
          flex: "1",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Live Preview
        </h3>
        <div
          className="container"
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div className="header">
            <img
              src={
                headerImage || "https://via.placeholder.com/600x200?text=Header"
              }
              alt="Header"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>

          {/* Title */}
          <div
            className="title"
            style={{
              textAlign: "center",
              fontSize: "24px",
              color: "#333",
              margin: "20px 0",
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          ></div>

          {/* Description */}
          <div
            className="description"
            style={{
              textAlign: "left",
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>

           {/* Button */}
         <div className="button" style={{ textAlign: "center", margin: "20px" }}>
            <a
              href="#"
              style={{
                textDecoration: "none",
                backgroundColor: buttonStyles.backgroundColor,
                color: buttonStyles.color,
                paddingTop: "10px",
                paddingRight: "20px",
                paddingLeft: "20px",
                borderRadius: "24px",
                display: "inline-block",
                fontSize: "18px",
              }}
              dangerouslySetInnerHTML={{ __html: buttonText }}
            ></a>
          </div>

          {/* Footer */}
          <div
            className="footer"
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <img
              src={
                footerLogo || "https://via.placeholder.com/60x60?text=Logo"
              }
              alt="Footer Logo"
              style={{
                width: "60px",
                height: "60px",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />
            <div dangerouslySetInnerHTML={{ __html: footerText }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;





