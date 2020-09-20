using System;
using System.Collections.Generic;

namespace OpenOrClosed.Core.ViewModels
{
    public class DaysViewModel
    {
        public Guid Id { get; set; }
        public string DayOfTheWeek { get; set; }
        public bool IsOpen { get; set; }
        public List<HoursViewModel> HoursOfBusiness { get; set; }
    }
}
