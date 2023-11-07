using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
namespace OpenOrClosed.Core.PropertyEditors
{
    public class SpecialHoursConfigurationEditor : ConfigurationEditor<SpecialHoursConfiguration>
    {

        public SpecialHoursConfigurationEditor(IIOHelper ioHelper, IEditorConfigurationParser editor) : 
            base(ioHelper, editor)
        {
        }
    }
}
