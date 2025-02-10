import Subscribe from "../models/subscribe.js";

export const subscribe = async (req, res) => {
    try{
        const { email } = req.body;
        // console.log(req.body);
        
//handle validation
if(!email){
    return res.status(400).json({ success: false, message: 'email is required'});
}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return res.status(400).json({ success: false, message: 'Invalid email format'});
}

//create new user

if(!email){
    return res.status(400).json({ success: false, message: 'This field is required'} )
}

//create a new user
const subscribe = new Subscribe({
      email
    });


//save the user to the database
await subscribe.save();

// send response

       // Send response
    return res.json({ success: true, message: "Subscription Successful", subscribe: {
        email: subscribe.email
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Subscription failed", error: err });
  }
};
