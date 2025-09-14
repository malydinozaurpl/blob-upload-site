#from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
from fastapi import HTTPException

class storage():

    def __init__(self):
        """Initiate storage account connection"""
        account_key = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="
        self.service = BlobServiceClient(account_url="http://127.0.0.1:10000/devstoreaccount1", credential=account_key)
    
    def close(self):
        """Close storage account connection"""
        self.service.close
    
    def createContainer(self, container: str):
        """Create container with specified name"""
        self.service.create_container(container)
        return f'Container {container} created'

    def checkContainer( self, dstContainer: str):
        """Check if a container exists"""
        try:
            container = self.service.get_container_client( dstContainer )
            container.get_container_properties()
            return container
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Container not found")

    def uploudBlockBlob( self, dstContainer: str, data, filename: str):
        """Upload file to blob container"""
        container = self.checkContainer( dstContainer )
        try:
            container.upload_blob( name=filename, data=data, overwrite=True )
            return "Data uploaded"
        except ResourceNotFoundError:
            return "file not found"

    def deleteBlockBlob( self, dstContainer: str, filename ):
        """Delete specific blob inside a container"""
        container = self.checkContainer( dstContainer )
        try:
            container.delete_blob( filename )
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="File not found")
    
    def listBlobs( self, dstContainer: str ):
        """Get names of all blobs in specific blob container"""
        container = self.checkContainer( dstContainer )
        return container.list_blobs()

    def downloadBlob( self, dstContainer: str, filename: str):
        """Download specific file from blob container"""
        container = self.checkContainer( dstContainer )
        try:
            blob = container.get_blob_client( filename )
            blob.get_blob_properties()
        except ResourceNotFoundError:
            raise HTTPException(status_code=404,detail="File not found")
        return blob.download_blob()


'''
# "rb" - read binary data, because everything is just a binary data
with open (file, "rb") as movie:
    test.upload_blob(name=file, data=movie, overwrite=True)
*
#for i in test.list_blob_names():
#    test.delete_blob(i)
'''
