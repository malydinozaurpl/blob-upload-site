from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

authRouter = APIRouter(prefix="/auth")

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="token")


def genPassHash( password: str ):
    encrypt = CryptContext(
        schemes="argon2", default="argon2"
    )
    return encrypt.hash( password )

def checkPassHash( password: str , dbHash: str ):
    decrypt = CryptContext()
    return decrypt.verify( secret = password, hash = dbHash)


password = "test"

print(genPassHash(password))