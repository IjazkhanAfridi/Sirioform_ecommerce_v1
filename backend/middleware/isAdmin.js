const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied, not an admin' });
    }
  };
  
  module.exports = isAdmin;
  