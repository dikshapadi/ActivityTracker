# app/controllers/visited_sites_controller.rb
class VisitedSitesController < ApplicationController
    skip_before_action :verify_authenticity_token
  
    # Action to fetch visited sites along with their count and total duration
    def index
        visited_sites = VisitedSite.group(:url)
                                     .select('url, COUNT(*) AS visit_count, SUM(duration) AS total_duration')
                                     .order('visit_count DESC')
        render json: visited_sites
    end
    
    # Action to create a new visited site
    def create
        visited_site = VisitedSite.new(visited_site_params)
        visited_site.visited_at = Time.current 
        if visited_site.save
        render json: visited_site, status: :created
        else
        render json: { errors: visited_site.errors.full_messages }, status: :unprocessable_entity
        end
    end
  
  
     # Action to update the duration of a visited site
     def update_duration
        visited_site = VisitedSite.find_by(url: params[:url])
        if visited_site
          # Convert duration parameter to integer
          duration = params[:duration].to_i
          visited_site.update(duration: duration)
          head :ok
        else
          render json: { error: 'Visited site not found' }, status: :not_found
        end
      end
      
    private
  
    def visited_site_params
      params.require(:visited_site).permit(:url)
    end
  end
  