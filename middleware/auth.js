// middleware/auth.js
const admin = require('../api/_firebase-admin');
const db = admin.firestore();

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ success: false, error: 'Invalid token format' });
    }

    // Verify the token using the Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Fetch the user's role from your 'users' collection in Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ success: false, error: 'User data not found.' });
    }
    
    // Attach user data to the request object for use in other APIs
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userDoc.data().name,
      role: userDoc.data().role,
    };
    
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
}

function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                message: `Your role is '${req.user.role}'. Required: ${roles.join(', ')}`,
            });
        }
        next();
    };
}

module.exports = { verifyToken, requireRole };
