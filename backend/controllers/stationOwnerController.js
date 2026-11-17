const {
  registerStationOwner,
  loginStationOwner,
  getOwnerProfile,
  updateOwnerProfile,
} = require("../services/stationOwnerService");


// Register Station Owner

const register = async (req, res) => {
  try {

    console.log("REGISTER API HIT");
    console.log("REQUEST BODY:", req.body);

    const id = await registerStationOwner(req.body);

    console.log("OWNER CREATED ID:", id);

    res.status(201).json({
      success: true,
      message: "Station Owner Registered Successfully",
      ownerId: id,
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
      error: error.message,
    });

  }
};


// Login Station Owner

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const owner = await loginStationOwner(email, password);


    if (!owner) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });

    }


    res.status(200).json({
      success: true,
      owner,
    });


  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message,
    });

  }

};


// Get Profile

const profile = async (req, res) => {

  try {

    const owner = await getOwnerProfile(req.params.id);


    if (!owner) {

      return res.status(404).json({
        success: false,
        message: "Owner Not Found",
      });

    }


    res.status(200).json({
      success: true,
      owner,
    });


  } catch (error) {

    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to Fetch Profile",
      error: error.message,
    });

  }

};


// Update Profile

const update = async (req, res) => {

  try {

    await updateOwnerProfile(req.params.id, req.body);


    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });


  } catch (error) {

    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Update Failed",
      error: error.message,
    });

  }

};


module.exports = {
  register,
  login,
  profile,
  update,
};