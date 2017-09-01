class API::CommentsController < ApplicationController
    before_action :set_campaign 
    before_action :set_campaign_comment, only: [:show, :update, :destroy]

    # GET /api/campaigns/:campaign_id/comments 
    def index 
        render json: @campaign.comments, status: 200
    end

    # GET /api/campaigns/:campaign_id/comments/:id 
    def show 
        render json: @comment, status: 200
    end

    # POST /api/campaigns/:campaign_id/comments 
    def create  
        @comment = @campaign.comments.create!(comment_params)
        render json: @comment, status: 201
    end

    # PUT /api/campaigns/:campaign_id/comments/:id
    def update 
        @comment.update(comment_params) 
        render json: @comment, status: 200
    end

    # DELETE /api/campaigns/:campaign_id/comments/:id
    def destroy 
        @comment.destroy 
        head :no_content
    end

    private 

        def comment_params 
            params.require(:comment).permit(:content)
        end

        def set_campaign
            @campaign = Campaign.find(params[:campaign_id])
        end 

        def set_campaign_comment
            @comment = @campaign.comments.find_by!(id: params[:id]) if @campaign
        end
end
