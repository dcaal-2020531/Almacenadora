export const validateAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "unauthorized: Admins only" });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Unauthorized role" });
    }
};