import CodePush from "react-native-code-push";
const CODE_PUSH_PRODUCTION_KEY = 'Va_vt5KDsYPHoBCIz-9K6nlhELUjd4a7e3a5-9ea1-45d8-9b3f-6f08d1f6119f'

export const doUpdate = (codePushStatusDidChange,codePushDownloadDidProgress) => {
    CodePush.checkForUpdate()
        .then((update) => {
            if (!update) {
                // console.log("The app is up to date!");
            } else {
                // console.log("An update is available! Should we download it?");
                // console.log(update);
            }
        });
    CodePush.sync({
        updateDialog: {
            appendReleaseDescription: true,
            descriptionPrefix:'\n\n更新内容：\n',
            title:'更新',
            mandatoryUpdateMessage:'',
            mandatoryContinueButtonLabel:'更新',
        },
        mandatoryInstallMode:CodePush.InstallMode.IMMEDIATE,
        deploymentKey: CODE_PUSH_PRODUCTION_KEY,
        },
        codePushStatusDidChange,
        codePushDownloadDidProgress);
}
