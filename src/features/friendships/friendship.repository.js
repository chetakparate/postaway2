import mongoose from "mongoose";
import { friendshipSchema } from "./friendship.schema.js";
import { userSchema } from "../users/user.schema.js";

const FriendshipModel = mongoose.model('Friendship', friendshipSchema);
const UserModel = mongoose.model('User', userSchema);

// get friends list
export const getFriends = async (userId) => {
    const user = await UserModel.find({ _id: userId });
    const result = await UserModel
        .find({ _id: userId }, { name: 1, email: 1, mobile: 1, age: 1, gender: 1, friends: 1, _id: 0 })
        .populate('friends', 'name email mobile age gender')
        .exec();
    console.log("user friend", result);
    return result;
}

// get pending friend requests
export const getPendingRequests = async (userId) => {
    const result = await UserModel
        .find({ _id: userId }, { name: 1, email: 1, mobile: 1, age: 1, gender: 1, pendingRequests: 1, _id: 0 })
        .populate('pendingRequests', 'name email mobile age gender')
        .exec();
    console.log("getPendingRequests", result);
    return result;
}

// toggle friendship
export const toggleFriendship = async (userId, friendId) => {
    const friendship = await FriendshipModel.findOneAndDelete({
        $or: [
            { requester: userId, recipient: friendId },
            { requester: friendId, recipient: userId }
        ]
    });
    console.log("friendship", friendship);
    if (friendship) {

        // removing pending requests from requester's record
        const user = await UserModel.findById(userId);
        user.pendingRequests.pop(friendId);

        // removing friendId if user is friends already
        if (user.friends.includes(friendId)) {
            user.friends.splice(0, 1);
        }

        await user.save();

        // removing pending requests from recipient's record
        const friend = await UserModel.findById(friendId);
        friend.pendingRequests.pop(userId);

        // removing friendId if user is friends already
        if (friend.friends.includes(userId)) {
            friend.friends.splice(0, 1);
        }

        await friend.save();

        return { message: 'Friendship removed' };
    } else {
        const newFriendship = new FriendshipModel({ requester: userId, recipient: friendId });
        await newFriendship.save();
        console.log("new friendship", newFriendship);

        // insering pending friend request into requester's pending list
        const user = await UserModel.findById(userId);
        user.pendingRequests.push(friendId);
        await user.save();

        // inserting record inside the recipients's pending list
        const friend = await UserModel.findById(friendId);
        friend.pendingRequests.push(userId);
        await friend.save();

        console.log("user record updated with updated pending request", user);

        return { message: 'Friendship request sent' };
    }
}

// respond to friendship request
export const respondToRequest = async (userId, friendId, status) => {

    console.log("userId, friendId, status, --->", userId, friendId, status)
    const friendship = await FriendshipModel.findOne({
        requester: friendId,
        recipient: userId,
        status: 'pending'
    });

    if (!friendship) {
        throw new Error('No pending request found');
    }

    friendship.status = status;
    await friendship.save();

    if (status === 'accepted') {
        // add to friends list
        await UserModel.findByIdAndUpdate(userId, { $push: { friends: friendId } });
        await UserModel.findByIdAndUpdate(friendId, { $push: { friends: userId } });

        // remove from pending requests list
        await UserModel.findByIdAndUpdate(friendId, { $pull: { pendingRequests: userId } });
        await UserModel.findByIdAndUpdate(userId, { $pull: { pendingRequests: friendId } });
    }

    return { message: `Friendship request ${status}` };
}