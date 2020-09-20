using System;

namespace OpenOrClosed.Core.ViewModels
{
    public class HoursViewModel
    {
        public Guid Id { get; set; }
        public string OpensAt { get; set; }
        public string ClosesAt { get; set; }
        public bool ByAppointmentOnly { get; set; } = false;
    }
}
