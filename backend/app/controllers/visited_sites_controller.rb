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
      url = visited_site_params[:url]
    
    if blacklisted?(url)
      render json: { error: 'This site is blacklisted' }, status: :forbidden
    else
      visited_site = VisitedSite.new(visited_site_params)
      if visited_site.save
        render json: visited_site, status: :created
      else
        render json: { errors: visited_site.errors.full_messages }, status: :unprocessable_entity
      end
    end
    end
  
  
    def update_duration
      visited_sites = VisitedSite.where(url: params[:url])
      if visited_sites.any?
        close_time = Time.current
        visited_sites.each do |visited_site|
          duration_in_seconds = (close_time - visited_site.visited_at).to_i
          duration_in_minutes = duration_in_seconds / 60 # Duration in minutes
          visited_site.update(duration: duration_in_minutes)
        end
        head :ok
      else
        render json: { error: 'Visited site not found' }, status: :not_found
      end
    end
    
    
    private
  
  def visited_site_params
    params.require(:visited_site).permit(:url)
  end
  def blacklisted?(url)
    BlacklistedSite.exists?(url: url)
  end
    
    

  end
  