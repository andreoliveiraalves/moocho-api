import type { User } from '../../models/userModel.js'


// Bidirectional validation of user friendship
export const validateUserFriendship = (user: User, other: User): boolean => {
    return user.friends.includes(other.id) || other.friends.includes(user.id)
}