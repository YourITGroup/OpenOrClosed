using Newtonsoft.Json;
using System;

namespace OpenOrClosed.Core.ViewModels
{
    public class HoursViewModel
    {
        //public Guid Id { get; set; }
        [JsonProperty("opensAt")]
        public DateTime OpensAt { get; set; }

        [JsonProperty("closesAt")]
        public DateTime ClosesAt { get; set; }

        [JsonProperty("byAppointmentOnly")]
        public bool ByAppointmentOnly { get; set; } = false;
    }
}
