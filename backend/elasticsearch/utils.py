def games_document_id(hash: str):
    return f"games_{hash}"


def playergames_document_id(hash: str, player: str):
    return f"playergames_{hash}_{player}"
