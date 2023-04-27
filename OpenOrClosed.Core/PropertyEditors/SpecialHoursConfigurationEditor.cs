using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
namespace OpenOrClosed.Core.PropertyEditors;

public class SpecialHoursConfigurationEditor : ConfigurationEditor<SpecialHoursConfiguration>
{

    public SpecialHoursConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
    {
    }
}
