using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MVC.Models
{
    public class MusicDbContext: DbContext
    {
//        public MusicDbContext() : base("DefaultConnection")
//        {
//        }

        public DbSet<Song> Songs { get; set; }

        public System.Data.Entity.DbSet<MVC.Models.Genre> Genres { get; set; }
    }
}