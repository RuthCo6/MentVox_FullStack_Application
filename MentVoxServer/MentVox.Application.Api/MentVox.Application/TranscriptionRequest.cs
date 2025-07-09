// TranscriptionRequest.cs
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class TranscriptionRequest
{
    [Required]
    public IFormFile Audio { get; set; }

    [Required]
    public string Language { get; set; }
}
