class BlacklistedSitesController < ApplicationController
    skip_before_action :verify_authenticity_token

  def index
    blacklisted_sites = BlacklistedSite.all
    render json: blacklisted_sites
  end

  def create
    blacklisted_site = BlacklistedSite.new(blacklisted_site_params)
    if blacklisted_site.save
      render json: blacklisted_site, status: :created
    else
      render json: { errors: blacklisted_site.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete_by_url
    blacklisted_site = BlacklistedSite.find_by(url: params[:url])
    if blacklisted_site
      blacklisted_site.destroy
      head :no_content
    else
      render json: { error: 'Blacklisted site not found' }, status: :not_found
    end
  end

  private

  def blacklisted_site_params
    params.require(:blacklisted_site).permit(:url)
  end
end
