﻿// <auto-generated />
using System;
using FriendlyNeighbourhoodLogger;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FriendlyNeighbourhoodLogger.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250326194244_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.3");

            modelBuilder.Entity("FriendlyNeighbourhoodLogger.Media", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateFinished")
                        .HasColumnType("TEXT");

                    b.Property<string>("MediaStatus")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("MediaType")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Media");
                });
#pragma warning restore 612, 618
        }
    }
}
