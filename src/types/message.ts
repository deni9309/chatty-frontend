export type Message = {
  _id: string
  senderId: string
  receiverId: string
  text: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  image: string
}

export type SingleMessage = {
  _id: string
  sender: {
    _id: string
    fullName: string
    email: string
    profilePic: string
  }
  receiver: {
    _id: string
    fullName: string
    email: string
    profilePic: string
  }
  image: string
  text: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

/**
  _id: '688281031a9129be14319679',
  sender: {
    fullName: 'Tsvetanka',
    email: 'slawkowa@abv.bg',
    profilePic: '',
    _id: '6879520a5e8e8414fb980b6a'
  },
  receiver: {
    fullName: 'Denitsa',
    email: 'deni9309@gmail.com',
    profilePic: 'https://res.cloudinary.com/dxbmfedmk/image/upload/v1752781247/chatty_profile_pics/6879504a5e8e8414fb980b39.jpg',
    _id: '6879504a5e8e8414fb980b39'
  },
  image: '',
  text: 'hi',
  createdAt: 2025-07-24T18:52:51.852Z,
  updatedAt: 2025-07-24T18:52:51.852Z,
  isDeleted: false
 */
