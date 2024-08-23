// import { customErrorHandler,appLevelErrorHandlerMiddleware } from '../../middlewares/errorHandler.js';
// import { getUserById } from '../users/user.repository.js';
import {
    getFriends,
    getPendingRequests,
    toggleFriendship,
    respondToRequest,
} from './friendship.repository.js';

// get friends list
export const friendList = async (req, res) => {
  try {
    const friendsDetails = await getFriends(req.params.userId);
    res.status(200).json(friendsDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // get pending friend requests
export const requests = async (req, res) => {
  try {
    const pendingRequests = await getPendingRequests(req._id);
    if(pendingRequests) {
      res.status(200).json(pendingRequests);
    } else { 
      throw new Error('No pending request found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// toggle friendship
export const toggleFriend = async (req, res) => {
  try {
    // const friendship = await createFriendship(req._id, req.params.friendId);
    const friendship = await toggleFriendship(req._id, req.params.friendId);
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// respond to friendship request
export const friendshipResponse = async (req, res) => {
  try {
    const friendship = await respondToRequest(req._id, req.params.friendId, req.body.status);
    res.status(200).json(friendship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};