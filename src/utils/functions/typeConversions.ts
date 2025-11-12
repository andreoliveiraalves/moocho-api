import type { User, SafeUser, FriendlyUser, ProfileUser } from '../../models/userModel.js'
import { formatDateToHumanReadable } from '../../utils/functions/formatDate.js'

export const toProfileUser = (user: User): ProfileUser => {
    const { accessToken, refreshToken, ...rest } = user
    return {
        ...rest,
        createdAt: formatDateToHumanReadable(user.createdAt)
    }
}

export const toSafeUser = (user: User): SafeUser => {
    const { accessToken, refreshToken, email, friends, requests, movies, shows, createdAt, ...rest } = user
    return rest
}

export const toFriendlyUser = (user: User): FriendlyUser => {
    const { accessToken, refreshToken, email, requests, ...rest } = user
    return {
        ...rest,
        createdAt: formatDateToHumanReadable(user.createdAt)
    }
}