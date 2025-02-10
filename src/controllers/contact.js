import Contact from "../models/contact.js";

export const contact = async (req, res) => {
    try{
        const { fullName, email, phoneNumber, message } = req.body;
        // console.log(req.body);
        
//handle validation
if(!fullName){
    return res.status(400).json({ success: false, message: 'Full Name is required'});
}
if(!email){
    return res.status(400).json({ success: false, message: 'email is required'});
}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return res.status(400).json({ success: false, message: 'Invalid email format'});
}
if(!phoneNumber) {
    return res.status(400).json({ success: false, message: 'phoneNumber is required'});
}
if(!message) {
    return res.status(400).json({ success: false, message: 'message is required'});
}

//create new user

if(!fullName || !email || !phoneNumber || !message){
    return res.status(400).json({ success: false, message: 'All fields are required'} )
}
    


//create a new user
const contact = new Contact({
    fullName,
      email, 
      phoneNumber,
      message
    });


//save the user to the database
await contact.save();

// send response

       // Send response
    return res.json({ success: true, message: "Contact Form Submitted Successfully", contact: {
        fullName: contact.fullName,
        email: contact.email,
       phoneNumber: contact.phoneNumber,
        message: contact.message
  
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Contact Form Submission failed", error: err });
  }
};
