interface Tag {
    name: string
    ownerId: string
}

interface TagWithPrivateKey extends Tag {
    privateKey: null | string
}
