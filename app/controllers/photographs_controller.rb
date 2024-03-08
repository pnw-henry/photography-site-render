class PhotographsController < ApplicationController

    def index
        s3_client = Aws::S3::Client.new
        presigner = Aws::S3::Presigner.new(client: s3_client)
        resp = s3_client.list_objects_v2(bucket: 'photography-site-content')

        @images = resp.contents.each_with_object([]) do |obj, arr|
            if obj.key.include? ".jpg"
                arr << {
                url: presigner.presigned_url(:get_object, bucket: 'photography-site-content', key: obj.key, expires_in: 86400),
                key: obj.key,
                last_modified: obj.last_modified
                }
            end
        end
        render json: @images

    rescue Aws::S3::Errors::ServiceError => e
        render json: { errors: e.message }, status: :internal_server_error
    end
end