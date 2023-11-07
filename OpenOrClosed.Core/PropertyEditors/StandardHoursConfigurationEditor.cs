using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace OpenOrClosed.Core.PropertyEditors;

public class StandardHoursConfigurationEditor : ConfigurationEditor<StandardHoursConfiguration>
{

    public StandardHoursConfigurationEditor(IIOHelper ioHelper, IEditorConfigurationParser editor) : 
        base(ioHelper, editor)
    {
    }
}
