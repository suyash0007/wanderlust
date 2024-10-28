const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res, next) => {
    try {
        let { username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            let savedUrl = res.locals.redirectUrl || "/listings"
            res.redirect(savedUrl);
        })
    } catch(err) {
        req.flash("error", err.message)
        res.redirect("/listings")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let savedUrl = res.locals.redirectUrl || "/listings"
    res.redirect(savedUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Successfully you logged out from the app!");
        res.redirect("/listings");
    })
}