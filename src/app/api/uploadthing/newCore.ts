import COS from "cos-js-sdk-v5";

// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
const cos = new COS({
  SecretId: process.env.NEXT_PUBLIC_TENCENTCLOUD_SECRET_ID, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey: process.env.NEXT_PUBLIC_TENCENTCLOUD_SECRET_KEY, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});
const BUCKET = "bucket-1311422338"; // 存储桶，由BucketName-APPID 组成
const REGION = "ap-beijing"; // 地域
export const cosUploadFile = (
  type: string,
  key: string,
  file: File,
  SliceSize = 1024 * 1024 * 5
) => {
  cos.uploadFile(
    {
      Bucket: BUCKET,
      Region: REGION, // 存储桶所在地域，例如ap-beijing，必须字段
      Key: `${type}/${key}`, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      Body: file, // 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象
      SliceSize: SliceSize, // 触发分块上传的阈值，超过5MB使用分块上传，非必须
      onTaskReady: function (taskId) {
        // 非必须
        console.log(taskId);
      },
      onProgress: function (progressData) {
        // 非必须
        console.log(JSON.stringify(progressData));
      },
      // 支持自定义headers 非必须
      Headers: {},
    },
    async function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        // const res = await fetch(data.Location);
        // const buffer = await res.arrayBuffer();
        // const imgMetadata = await sharp(buffer).metadata();
        // const { width, height } = imgMetadata;
        // console.log("imgMetadata", imgMetadata);

        // // const { configId } = metadata.input;
        // // if (!configId) {
        // const configuration = await db.configuration.create({
        //   data: {
        //     imageUrl: data.Location,
        //     height: height || 500,
        //     width: width || 500,
        //   },
        // });
        // return { configId: configuration.id };
        // } else {
        //   const updatedConfiguration = await db.configuration.update({
        //     where: {
        //       id: configId,
        //     },
        //     data: {
        //       croppedImageUrl: file.url,
        //     },
        //   });
        //   return { configId: updatedConfiguration.id };
        // }
      }
    }
  );
};
