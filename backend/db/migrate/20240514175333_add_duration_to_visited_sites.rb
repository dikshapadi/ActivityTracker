class AddDurationToVisitedSites < ActiveRecord::Migration[7.1]
  def change
    add_column :visited_sites, :duration, :integer
  end
end
