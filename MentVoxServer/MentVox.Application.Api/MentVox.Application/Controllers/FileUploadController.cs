using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Transfer;
using System.IO;
using System.Threading.Tasks;

namespace FileUploadExample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private const string BucketName = "YOUR_BUCKET_NAME"; // כאן תשים את שם הדלי שלך ב-AWS S3

        public FileUploadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), file.FileName);

            // שמירה ל-local דיסק (אפשר לשדרג עם העלאה ישירה ל-AWS)
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Upload the file to AWS S3
            var transferUtility = new TransferUtility(_s3Client);
            try
            {
                // העלאה ל-AWS S3
                await transferUtility.UploadAsync(filePath, BucketName);

                // מחיקת הקובץ מה-local disk אחרי העלאה
                System.IO.File.Delete(filePath);

                return Ok(new { Message = "File uploaded successfully!" });
            }
            catch (AmazonS3Exception e)
            {
                return StatusCode(500, new { Message = e.Message });
            }
        }
    }
}
