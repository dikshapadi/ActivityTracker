Rails.application.routes.draw do
  # Routes for visited sites
  resources :visited_sites, only: [:index, :create] do
    put :update_duration, on: :collection
  end

  # Routes for blacklisted sites
  resources :blacklisted_sites, only: [:index, :create, :destroy], param: :url do
    delete 'delete_by_url', on: :collection
  end
end
