using System;
using System.Collections.Generic;

namespace OpenOrClosed.Core.ViewModels
{
    public class SpecialDaysViewModel
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public bool IsOpen { get; set; }
        public List<HoursViewModel> HoursOfBusiness { get; set; }
    }
}
